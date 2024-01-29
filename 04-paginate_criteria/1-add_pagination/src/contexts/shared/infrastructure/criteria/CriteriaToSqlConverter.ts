import { Criteria } from "../../domain/criteria/Criteria";
import { Filter } from "../../domain/criteria/Filter";

export class CriteriaToSqlConverter {
	convert(fieldsToSelect: string[], tableName: string, criteria: Criteria): string {
		let query = `SELECT ${fieldsToSelect.join(", ")} FROM ${tableName}`;

		if (criteria.hasFilters()) {
			query = query.concat(" WHERE ");

			const whereQuery = criteria.filters.value.map((filter) => this.generateWhereQuery(filter));

			query = query.concat(whereQuery.join(" AND "));
		}

		if (criteria.hasOrder()) {
			query = query.concat(
				` ORDER BY ${criteria.order.orderBy.value} ${criteria.order.orderType.value.valueOf()}`,
			);
		}

		if (criteria.hasLimit()) {
			query = query.concat(` LIMIT ${criteria.limit}`);
		}

		if (criteria.hasOffset()) {
			query = query.concat(` OFFSET ${criteria.offset}`);
		}

		return `${query};`;
	}

	private generateWhereQuery(filter: Filter) {
		if (filter.operator.isContains()) {
			return `${filter.field.value} LIKE '%${filter.value.value}%'`;
		}

		if (filter.operator.isNotContains()) {
			return `${filter.field.value} NOT LIKE '%${filter.value.value}%'`;
		}

		return `${filter.field.value} ${filter.operator.value} '${filter.value.value}'`;
	}
}
