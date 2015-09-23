/**
 * Created by Fred Lackey <fred.lackey@gmail.com> on 9/21/2015.
 */

'use strict';

var reader = function (info) {

    // region helpers
    var getNode = function (name) {
        var nodes = info.items.filter(function (item) {
            return (item.name.toUpperCase() == name.toUpperCase());
        });
        return (nodes.length == 1)
            ? nodes[0]
            : null;
    };
    var getItems = function (name, owner) {
        var node = getNode(name);
        if (!node) { return []; }
        node.items = node.items || [];
        return node.items.filter(function (item) {
            return owner
                ? (item['TABLE_SCHEMA'] && item['TABLE_SCHEMA'].toUpperCase() == owner.toUpperCase())
                : true;
        });
    };
    var getUnique = function (list, isCaseSensitive) {
        var result  = [],
            used    = [];
        list.forEach(function (item) {
            if (typeof item != 'undefined' && item != null) {
                if (!!isCaseSensitive) {
                    if (used.indexOf(item) < 1) {
                        used.push(item);
                        result.push(item);
                    }
                } else {
                    if (used.indexOf(item.toUpperCase()) < 1) {
                        used.push(item.toUpperCase());
                        result.push(item);
                    }
                }
            }
        });
        return result;
    };
    // endregion

    var ops = {};             // Operations to export

    // region Basics
    var getDatabase = function () {
        return (!info.database || !info.server || !info.created)
            ? null
            : {
                database:   info.database,
                server:     info.server,
                user:       info.user,
                created:    info.created
              };
    };
    var getTables = function (owner) {
        return getItems('tables').filter(function (table) {
            return owner
                ? (table['TABLE_SCHEMA'] && table['TABLE_SCHEMA'].toUpperCase() == owner.toUpperCase())
                : true;
        });
    };
    var getViews = function (owner) {
        return getItems('views').filter(function (view) {
            return owner
                ? (view['TABLE_SCHEMA'] && view['TABLE_SCHEMA'].toUpperCase() == owner.toUpperCase())
                : true;
        });
    };
    var getOwnerNames = function () {
        var list = [];
        getTables().forEach(function (item) {
            list.push(item['TABLE_SCHEMA']);
        });
        getViews().forEach(function (item) {
            list.push(item['TABLE_SCHEMA']);
        });
        return getUnique(list, false);
    };
    var getColumns = function (owner, tableOrView) {
        return getItems('columns', owner).filter(function (column) {
            return (column['TABLE_NAME'].toUpperCase() == tableOrView.toUpperCase());
        });
    };

    ops.database = getDatabase;
    ops.tables = getTables;
    ops.views = getViews;
    ops.ownerNames = getOwnerNames;
    ops.columns = getColumns;
    // endregion

    // region Foreign Keys
    var getFKMembership = function (name) {
        return getItems('fkMembership').filter(function(item){
            return (item['FK_NAME'].toUpperCase() == name.toUpperCase());
        });
    };
    var getFKMembershipByFK = function (owner, table, column) {
        return getItems('fkMembership').filter(function(item){
            if (owner && item['FK_SCHEMA'].toUpperCase() != owner.toUpperCase()) { return false; }
            if (table && item['FK_TABLE'].toUpperCase() != table.toUpperCase()) { return false; }
            if (column && item['FK_COLUMN'].toUpperCase() != column.toUpperCase()) { return false; }
            return true;
        });
    };
    var getFKMembershipByPK = function (owner, table, column) {
        return getItems('fkMembership').filter(function(item){
            if (owner && item['PK_SCHEMA'].toUpperCase() != owner.toUpperCase()) { return false; }
            if (table && item['PK_TABLE'].toUpperCase() != table.toUpperCase()) { return false; }
            if (column && item['PK_COLUMN'].toUpperCase() != column.toUpperCase()) { return false; }
            return true;
        });
    };
    var isFKMemberColumn = function (owner, table, column) {
        return (getFKMembershipByFK(owner, table, column).length > 0);
    };
    var isFKTargetColumn = function (owner, table, column) {
        return (getFKMembershipByPK(owner, table, column).length > 0);
    };
    var getFKConstraints = function (owner, table) {
        return getItems('tableConstraints', owner).filter(function (item) {
            return (item['TABLE_NAME'].toUpperCase() == table.toUpperCase() && item['CONSTRAINT_TYPE'].toUpperCase() == 'FOREIGN KEY');
        });
    };
    var getFKSources = function (owner, table, column) {
        var result = [];
        getFKMembershipByPK(owner, table, column).forEach(function (item) {
            result.push({
                owner:  item['FK_SCHEMA'],
                table:  item['FK_TABLE'],
                column: item['FK_COLUMN']
            });
        });
        return result;
    };
    var getFKTarget = function (owner, table, column) {
        var membership = getFKMembershipByFK(owner, table, column);
        if (!membership) { return null; }
        return {
            owner:  membership['PK_SCHEMA'],
            table:  membership['PK_TABLE'],
            column: membership['PK_COLUMN'],
            name:   membership['FK_NAME']
        }
    };

    ops.foreignKeys = {
        byName:         getFKMembership,
        byMember:       getFKMembershipByFK,
        byTarget:       getFKMembershipByPK,
        isMember:       isFKMemberColumn,
        isTarget:       isFKTargetColumn,
        constraints:    getFKConstraints,
        sources:        getFKSources,
        target:         getFKTarget
    };
    // endregion

    // region Primary Keys
    var getPKConstraints = function (owner, table) {
        return getItems('tableConstraints', owner).filter(function (item) {
            return (item['TABLE_NAME'].toUpperCase() == table.toUpperCase() && item['CONSTRAINT_TYPE'].toUpperCase() == 'PRIMARY KEY');
        });
    };
    var getPKColumns = function (owner, table) {
        var result = [];
        getPKConstraints(owner, table).forEach(function (constraint) {
            getItems('keyColumnUsage', owner).forEach(function (columnUsage) {
                if (constraint['CONSTRAINT_NAME'].toUpperCase() == columnUsage['CONSTRAINT_NAME'].toUpperCase()) {
                    result.push({
                        name:       columnUsage['COLUMN_NAME'],
                        position:   columnUsage['ORDINAL_POSITION']
                    });
                }
            });
        });
        return result;
    };
    var getPKPosition = function (owner, table, column) {
        var matches = getPKColumns(owner, table).filter(function (item) {
            return (item.name.toUpperCase() == column.toUpperCase())
        });
        return (matches.length == 1) ? matches[0].position : -1;
    };
    var isPKColumn = function (owner, table, column) {
        return (getPKPosition(owner, table, column) >= 0);
    };

    ops.primaryKeys = {
        constraints:    getPKConstraints,
        columns:        getPKColumns,
        position:       getPKPosition,
        isColumn:       isPKColumn
    };
    // endregion

    // region Indicies

    var getIndices = function (owner, table, includePrimaryKey) {
        return getItems('indices', owner).filter(function (item) {
            if ((!(!!includePrimaryKey)) && item['IS_PRIMARY_KEY'].toUpperCase() == 'TRUE') { return false; }
            return (item['TABLE_NAME'].toUpperCase() == table.toUpperCase());
        });
    };
    var isIndexMember = function (owner, table, columm, includePrimaryKey) {
        var items = getIndices(owner, table, includePrimaryKey).filter(function (item) {
            return (item['COLUMN_NAME'].toUpperCase() == columm.toUpperCase());
        });
        return (items.length > 0);
    };

    ops.indices = {
        byTable:    getIndices,
        isMember:   isIndexMember
    };

    // endregion
        
    return ops
};

module.exports = reader;