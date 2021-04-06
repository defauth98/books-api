import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createBooks1607285624631 implements MigrationInterface {
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
          { name: 'price', type: 'integer' },
          { name: 'publisher', type: 'varchar' },
          { name: 'state_book', type: 'varchar' },
          { name: 'date_edition', type: 'varchar' },
          {
            name: 'created_at',
            type: 'date',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
