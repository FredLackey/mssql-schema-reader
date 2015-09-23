/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var	queryText = {
	constraints: 'SELECT * FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS',
	columnDomainUsage: 'SELECT * FROM INFORMATION_SCHEMA.COLUMN_DOMAIN_USAGE',
	columnPrivileges: 'SELECT * FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES',
	columns: 'SELECT * FROM INFORMATION_SCHEMA.COLUMNS',
	constraintColumnUsage: 'SELECT * FROM INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE',
	constraintTableUsage: 'SELECT * FROM INFORMATION_SCHEMA.CONSTRAINT_TABLE_USAGE',
	domainConstraints: 'SELECT * FROM INFORMATION_SCHEMA.DOMAIN_CONSTRAINTS',
	domains: 'SELECT * FROM INFORMATION_SCHEMA.DOMAINS',
	keyColumnUsage: 'SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE',
	parameters: 'SELECT * FROM INFORMATION_SCHEMA.PARAMETERS',
	referentialConstraints: 'SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS',
	routineColumns: 'SELECT * FROM INFORMATION_SCHEMA.ROUTINE_COLUMNS',
	routines: 'SELECT * FROM INFORMATION_SCHEMA.ROUTINES',
	schemata: 'SELECT * FROM INFORMATION_SCHEMA.SCHEMATA',
	tableConstraints: 'SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS',
	tablePrivileges: 'SELECT * FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES',
	tables: 'SELECT * FROM INFORMATION_SCHEMA.TABLES',
	viewColumnUsage: 'SELECT * FROM INFORMATION_SCHEMA.VIEW_COLUMN_USAGE',
	viewTableUsage: 'SELECT * FROM INFORMATION_SCHEMA.VIEW_TABLE_USAGE',
	views: 'SELECT * FROM INFORMATION_SCHEMA.VIEWS',

	fkMembership: 'SELECT s1.name AS FK_SCHEMA, o1.name AS FK_TABLE, c1.name AS FK_COLUMN, fk.name AS FK_NAME, s2.name AS PK_SCHEMA, o2.name AS PK_TABLE, c2.name AS PK_COLUMN, pk.name AS PK_NAME, fk.delete_referential_action_desc AS DELETE_ACTION, fk.update_referential_action_desc AS UPDATE_ACTION FROM sys.objects o1 INNER JOIN sys.schemas s1 ON o1.schema_id = s1.schema_id INNER JOIN sys.foreign_keys fk ON o1.object_id = fk.parent_object_id INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id INNER JOIN sys.columns c1 ON fkc.parent_object_id = c1.object_id AND fkc.parent_column_id = c1.column_id INNER JOIN sys.columns c2 ON fkc.referenced_object_id = c2.object_id AND fkc.referenced_column_id = c2.column_id INNER JOIN sys.objects o2 ON fk.referenced_object_id = o2.object_id INNER JOIN sys.schemas s2 ON o2.schema_id = s2.schema_id INNER JOIN sys.key_constraints pk ON fk.referenced_object_id = pk.parent_object_id AND fk.key_index_id = pk.unique_index_id ORDER BY s1.name, o1.name, s2.name, o2.name, fkc.constraint_column_id',
    indices: 'SELECT TABLE_SCHEMA = s.name, INDEX_NAME = ind.name, COLUMN_NAME = col.name, TABLE_NAME = t.name, INDEX_ID = ind.index_id, COLUMN_ID = ic.index_column_id, INDEX_TYPE = ind.type_desc, IS_UNIQUE = (CASE WHEN ind.is_unique = \'1\' THEN \'TRUE\' ELSE \'FALSE\' END), IS_PRIMARY_KEY = (CASE WHEN ind.is_primary_key = \'1\' THEN \'TRUE\' ELSE \'FALSE\' END) FROM sys.indexes ind INNER JOIN sys.index_columns ic ON  ind.object_id = ic.object_id and ind.index_id = ic.index_id INNER JOIN sys.columns col ON ic.object_id = col.object_id and ic.column_id = col.column_id INNER JOIN sys.tables t ON ind.object_id = t.object_id INNER JOIN sys.schemas s ON t.schema_id = s.schema_id WHERE t.is_ms_shipped = 0 ORDER BY t.name, ind.index_id, ic.index_column_id '
};

var getList = function () {
	var list = [];
	Object.keys(queryText).forEach(function (key) {
		list.push({ name: key, text: queryText[key] });
	});
	return list;
};

var queryList = getList();

module.exports = {
	items: queryText,
	list: queryList
};