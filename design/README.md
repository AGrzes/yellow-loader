# Model Process
Process used to generate and use model can be separated into few main steps
* Scan data sources
* Extract entities
* (optional) Persistent store save
* (optional) Persistent store load
* Build model
* Enrich model 
* Index model
* Use model

The loader module is concerned with only first 3 steps

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
  * project - model project identifier
  * rule - load rule identifier
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

## File Data Source
File plugins scans file system for specified files and expose them to rest of pipeline. 
It is also responsible for parsing known file formats by calling configured parser plugins.

### Location
Location is composed of
* path - location relative to project root

### Data
File plugin generates data with following fields
* content - content of file - raw or parsed
* metadata - file metadata
  * size - size of file
  * updated - last modified time
  * type - content type

### Configuration
File plugin uses paths relative to project root. d

File plugin on default will scan whole project did
To change this one can define one or more file pad

File plugin will use all loaded parser plugins - unless configured with specific plugins.

## JIRA Data Source
TBD
## Confluence Data Source
TBD
## HTTP Data Source
TBD

# Entity Extraction
Entity extraction is a process that converts stream of data source events into a stream of information about entities.

The most important aspects of this process are
* Splitting
* Entity identification
* Data Mapping
## Splitting
Often one chunk of data from data source contain information about multiple entities.
Two most common scenarios are
* The data contains a list of entities.
* The data contains one main entity and embedded secondary entities.
* The data contains one main entity and relations to external entities. This means that reverse relation from the target entities have to be stated.

## Entity identification
Entity identification is assigning a chunk of data from data source to an logical entity. 
It is done by calculating entity key based on any and all data provided.

## Data Mapping
After Splitting and Identification there is a place to transform data - from format specific to source plugin to some universal format that may be result of multiple sources.
Two most common scenarios are
* Transforming data source metadata into entity attributes
* Removing data source specific attributes
* Standardizing filed formats - for example for dates and numbers

# Storage
Storage should be able to persist stream of entity events and replay it later.
## CouchDB
CouchDB is a document database that is wel suited for entity stream storage. 
CouchDB storage plugin uses source and entity key to calculate document key - so updates from the same source are stored as document updates.
