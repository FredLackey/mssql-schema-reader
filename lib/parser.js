/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var reader = require('./reader');

var parser = function (info) {
    var doc = reader(info);

    var ops = {};

    var getColumnSchemas = function (owner, table) {
        var result = [];
        doc.columns(owner, table).forEach(function (rawTableColumn) {

            var column = {
                name:           rawTableColumn['COLUMN_NAME'],
                position:       rawTableColumn['ORDINAL_POSITION'],
                defaultValue:   rawTableColumn['COLUMN_DEFAULT'],
                isNullable:     (rawTableColumn['IS_NULLABLE'].toUpperCase() == 'YES' || rawTableColumn['IS_NULLABLE'].toUpperCase() == 'TRUE'),
                nativeType:     rawTableColumn['DATA_TYPE'],
                maxLength:      rawTableColumn['CHARACTER_MAXIMUM_LENGTH'],
                maxOctetLength: rawTableColumn['CHARACTER_OCTET_LENGTH'],
                precision:      rawTableColumn['NUMERIC_PRECISION'],
                scale:          rawTableColumn['NUMERIC_SCALE'],
                charSet:        rawTableColumn['CHARACTER_SET_NAME'],
                collation:      rawTableColumn['COLLATION_NAME'],
                isForeignKey:   doc.foreignKeys.isMember(owner, table, rawTableColumn['COLUMN_NAME']),
                fkTarget:       doc.foreignKeys.target(owner, table, rawTableColumn['COLUMN_NAME']),
                fkSources:      doc.foreignKeys.sources(owner, table, rawTableColumn['COLUMN_NAME']),
                isPrimaryKey:   doc.primaryKeys.isColumn(owner, table, rawTableColumn['COLUMN_NAME']),
                pkPosition:     doc.primaryKeys.position(owner, table, rawTableColumn['COLUMN_NAME'])
            };

            result.push(column);
        });
        return result;
    };
    var getIndexSchemas = function (owner, table) {

        var items       = [],
            names       = [],
            rawItems    = doc.indices.byTable(owner, table);

        // Step 1 - Initialize the index
        rawItems.forEach(function (rawIndex) {
            var name = rawIndex['INDEX_NAME'].toUpperCase();
            if (names.indexOf(name) < 0) {
                names.push(name);
                items.push({
                    id:             rawIndex['INDEX_ID'],
                    name:           name,
                    type:           rawIndex['INDEX_TYPE'],
                    isUnique:       (rawIndex['IS_UNIQUE'].toUpperCase() == 'TRUE'),
                    isPrimaryKey:   (rawIndex['IS_PRIMARY_KEY'].toUpperCase() == 'TRUE'),
                    columns:        []
                });
            }
        });

        // Step 2 - Populate the columns
        for (var i = 0; i < items.length; i += 1) {
            rawItems.forEach(function (rawIndex) {
                if (items[i].name.toUpperCase() == rawIndex['INDEX_NAME'].toUpperCase()) {
                    items[i].columns.push({
                        id:     rawIndex['COLUMN_ID'],
                        name:   rawIndex['COLUMN_NAME']
                    })
                }
            })
        }

        return items;
    };

    var getSchema = function () {

        var rawDb = doc.database();
        if (!rawDb) { return null; }

        var schema = doc.database();
        schema.owners = [];

        doc.ownerNames().forEach(function (ownerName) {

            var owner = {
                name:       ownerName,
                isDefault:  (ownerName.toUpperCase() == 'DBO'),
                tables:     [],
                views:      []
            };

            doc.tables(ownerName).forEach(function (rawTable) {

                var table = {
                    name:               rawTable['TABLE_NAME'],
                    owner:              rawTable['TABLE_SCHEMA'],
                    isDefaultOwner:     (rawTable['TABLE_SCHEMA'].toUpperCase() == 'DBO'),
                    columns:            getColumnSchemas(ownerName, rawTable['TABLE_NAME']),
                    indicies:           getIndexSchemas(ownerName, rawTable['TABLE_NAME'])
                };

                owner.tables.push(table);

            });

            doc.views(ownerName).forEach(function (rawView) {

                var table = {
                    name:               rawView['TABLE_NAME'],
                    owner:              rawView['TABLE_SCHEMA'],
                    isDefaultOwner:     (rawView['TABLE_SCHEMA'].toUpperCase() == 'DBO'),
                    columns:            getColumnSchemas(ownerName, rawView['TABLE_NAME'])
                };

                owner.views.push(table);

            });

            schema.owners.push(owner);
        });

        return schema;
    };

    return {
        getSchema:  getSchema,
    }
};

module.exports = parser;