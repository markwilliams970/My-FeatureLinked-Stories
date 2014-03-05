My-FeatureLinked-Stories
=========================

## Overview
Simple app to provide a table showing Rally Stories and their linked features, where the following query criterion condition is met:

(((ScheduleState > "Defined") AND (ScheduleState < "Accepted")) AND (((Feature.Owner = "user@company.com") OR (Feature.Notes contains "user@company.com")) OR (Notes contains "user@company.com")))

![App Screenshot](https://raw.github.com/markwilliams970/My-FeatureLinked-Stories/master/img/screenshot.png)

## License

AppTemplate is released under the MIT license.  See the file [LICENSE](https://raw.github.com/RallyApps/AppTemplate/master/LICENSE) for the full text.
