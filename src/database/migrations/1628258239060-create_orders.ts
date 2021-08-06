import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class createOrders1628258239060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'done',
            type:'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
        ],
      })
    );

    await queryRunner.addColumn("orders", new TableColumn({
      name: "userId",
      type: "int"
    }));

    await queryRunner.createForeignKey("orders", new TableForeignKey({
      columnNames: ["userId"],
      referencedColumnNames: ["id"],
      referencedTableName: "users",
      onDelete: "CASCADE"
    }));
    
    await queryRunner.addColumn("orders", new TableColumn({
      name: "bookId",
      type: "int"
    }));

    await queryRunner.createForeignKey("orders", new TableForeignKey({
      columnNames: ["bookId"],
      referencedColumnNames: ["id"],
      referencedTableName: "books",
      onDelete: "CASCADE"
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
