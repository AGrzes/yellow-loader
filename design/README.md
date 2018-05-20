# Model Process
Process used to generate and use model can be separated into few main steps
* Scan data sources
* Extract entities
* Enrich entities
* (optional) Persistent store save
* (optional) Persistent store load
* Build model
* Enrich model 
* Index model
* Use model

The loader module is concerned with only first 4 steps

# Data sources
Dedicated plugins handles details of specific sources of data and exposes them in universal way for further processing.
The data source may operate in one of three modes:
* Scan - single pass through data
* Watch - continuous monitoring for data changes
* Lookup - fetch specific piece of data on demand

Not every plugin must support all three modes.

Plugin should accept configuration - preferably constructed by supplied builder and then perform data load.
Plugin should provide observable that exposes data in form of events.

Event schema should be as follow:
* type - type of event
* source - descriptor of source
  * plugin - identifier of plugin generating events
  * location - plugin specific object describing location of source data
  * alt - plugin specific object describing alternative location of source dat
* data - plugin specific object containing data
* session - session identifier

Event types should be one of the following
* start - session initiation - should be first event - only `type` and `session` should be present
* end - session finish - no events should be sent after the event - only `type` and `session` should be present
* data - piece of data
* delete - if plugin is able to detect deletion in source then should propagate this information - should not sent `data` field
* move - if plugin is able to detect move in source then should propagate this information - it should send original location in `source.alt` field
