import {
  MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey,
} from 'typeorm';

export class createBooks1628258232677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'price', type: 'decimal' },
          { name: 'state_book', type: 'varchar' },
          { name: 'date_edition', type: 'varchar' },
          { name: 'image_path', type: 'varchar' },
        ],
      }),
    );

    await queryRunner.addColumn('books', new TableColumn({
      name: 'publisherId',
      type: 'int',
    }));

    await queryRunner.createForeignKey('books', new TableForeignKey({
      columnNames: ['publisherId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'publishers',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
