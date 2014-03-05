My-FeatureLinked-Stories
=========================

## Overview
Simple app to provide a table showing Rally Stories and their linked features, where the following query criterion condition is met:

(((ScheduleState > "Defined") AND (ScheduleState < "Accepted")) AND (((Feature.Owner = "user@company.com") OR (Feature.Notes contains "user@company.com")) OR (Notes contains "user@company.com")))

 (Stories, Defects, Test Cases, or Tasks) that have attachments, including a list of links to their attachments.

## License

AppTemplate is released under the MIT license.  See the file [LICENSE](https://raw.github.com/RallyApps/AppTemplate/master/LICENSE) for the full text.
