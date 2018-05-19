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
