const CoffeeLot = require('./CoffeeLot');
const Marker = require('./Marker');
const Region = require('./Region');
const Country = require('./Country');
const Continent = require('./Continent');
const Roasting = require('./Roasting');
const ProcessingMethod = require('./ProcessingMethod');
const Supplier = require('./Supplier');
const Weight = require('./Weight');
const TasteTag = require('./TasteTag');
const CoffeeLotTag = require('./CoffeeLotTag');


Country.belongsTo(Continent, { foreignKey: 'continentID' });
Region.belongsTo(Country, { foreignKey: 'countryID' });
CoffeeLot.belongsTo(Region, { foreignKey: 'regionID' });

CoffeeLot.belongsTo(Roasting, { foreignKey: 'roastingID' });
CoffeeLot.belongsTo(ProcessingMethod, { foreignKey: 'methodID' });
CoffeeLot.belongsTo(Supplier, { foreignKey: 'supplierID' });
CoffeeLot.belongsTo(Weight, { foreignKey: 'weightID' });

CoffeeLot.hasOne(Marker, { foreignKey: 'lotID' });
Marker.belongsTo(CoffeeLot, { foreignKey: 'lotID' });

CoffeeLot.belongsToMany(TasteTag, {
  through: CoffeeLotTag,
  foreignKey: 'lotID',
  otherKey: 'tagID'
});
TasteTag.belongsToMany(CoffeeLot, {
  through: CoffeeLotTag,
  foreignKey: 'tagID',
  otherKey: 'lotID'
});

module.exports = {
  CoffeeLot,
  Marker,
  Region,
  Country,
  Continent,
  Roasting,
  ProcessingMethod,
  Supplier,
  Weight,
  TasteTag,
  CoffeeLotTag
};