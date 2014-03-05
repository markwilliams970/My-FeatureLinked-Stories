Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'gridContainer',
            columnWidth: 1
        },
        {
            xtype: 'container',
            itemId: 'queryContainer'
        }
    ],

    _rallyHost: null,
    _rallyServer: null,
    _artifactRecords: [],
    _queryContainer: null,
    _artifactGrid: null,
    _typeFeature: "/PortfolioItem/Feature",

    launch: function() {
        this._getHostName();
    },

    _getHostName: function() {
        testUrl = window.location.hostname || "rally1.rallydev.com";
        testUrlSplit = testUrl.split("/");
        if (testUrlSplit.length === 1) {
            this._rallyHost = "rally1.rallydev.com";
        } else {
            this._rallyHost = testUrlSplit[2];
        }
        this._rallyServer = "https://" + this._rallyHost;
        console.log(this._rallyServer);
        this._getPITypes();
    },


    _getPITypes: function() {

        console.log('_getPITypes');
        var me = this;

        var piDataStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'TypeDefinition',
            autoLoad: true,
            fetch: true,
            listeners: {
                scope: this,
                load: me._PITypeStoreLoaded
            },
            filters: [
                {
                    property: 'Parent.Name',
                    operator: '=',
                    value: 'Portfolio Item'
                },
                {
                    property: 'Ordinal',
                    operator: '=',
                    value: 0
                }
            ]
        });
    },

    _PITypeStoreLoaded: function(store, records) {
        this._typeFeature = records[0].get('TypePath').toLowerCase();
        this._getArtifacts();
    },

    _getArtifacts: function() {

        var currentUser = this.getContext().getUser().UserName;

        var stateFiltersArray = [
                {
                    property: 'ScheduleState',
                    operator: '>',
                    value: 'Defined'
                },
                {
                    property: 'ScheduleState',
                    operator: '<',
                    value: 'Accepted'
                }
        ];

        var userFiltersArray = [
            {
                property: 'Feature.Owner',
                operator: '=',
                value: currentUser
            },
            {
                property: 'Feature.Notes',
                operator: 'contains',
                value: currentUser
            },
            {
                property: 'Notes',
                operator: 'contains',
                value: currentUser
            }
        ];

        var stateFilters = Rally.data.wsapi.Filter.and(stateFiltersArray);
        var userFilters = Rally.data.wsapi.Filter.or(userFiltersArray);

        var storeFilter = stateFilters.and(userFilters);

        this._queryContainer = this.down('#queryContainer').add({
            xtype: 'container',
            html: "Showing Stories matching the following Query:<br/>" + storeFilter.toString()
        });

        this._artifactStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'UserStory',
            fetch: ['ObjectID', 'FormattedID', 'Name', 'Owner', 'Notes', 'Feature', 'FormattedID', 'Owner', 'Notes'],
            autoLoad: true,
            context: {
                projectScopeUp: false,
                projectScopeDown: false
            },
            listeners: {
                scope: this,
                load: this._artifactStoreLoaded
            },
            filters: storeFilter
        });
    },

    _artifactStoreLoaded: function(store, records) {
        var me = this;

        me._artifactRecords = records;
        me._makeGrid();
    },

    _makeGrid: function() {

        var me = this;

        if (me._artifactGrid) {
            me._artifactGrid.destroy();
        }

        var gridStore = Ext.create('Rally.data.custom.Store', {
            data: me._artifactRecords,
            pageSize: 50,
            remoteSort: false
        });

        me._artifactGrid = Ext.create('Rally.ui.grid.Grid', {
            itemId: 'artifactGrid',
            store: gridStore,

            columnCfgs: [
                {
                    text: 'Formatted ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name', dataIndex: 'Name', flex: 1
                },
                {
                    text: 'Owner', dataIndex: 'Owner',
                    renderer: function(value) {
                        return value._refObjectName;
                    },
                    flex: 1
                },
                {
                    text: 'Feature', dataIndex: 'Feature',
                    renderer: function(value) {
                        if (value) {
                            var featureName = value._refObjectName;
                            var featureFormattedID = value.FormattedID;
                            var featureObjectID = value.ObjectID;
                            var labelString = featureFormattedID + ": " + featureName;

                            var featureHtml = '<a href="' + me._rallyServer + "/#/detail/" + me._typeFeature + "/" +
                                    featureObjectID + '"/>' +
                                    labelString + '</a>';
                            return featureHtml;
                        } else {
                            return "No Associated Feature";
                        }
                    },
                    flex: 1
                }
            ]
        });

        me.down('#gridContainer').add(me._artifactGrid);
        me._artifactGrid.reconfigure(gridStore);
    }

});