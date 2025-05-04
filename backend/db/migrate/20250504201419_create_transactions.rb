class CreateTransactions < ActiveRecord::Migration[7.2]
  def change
    create_table :transactions do |t|
      t.string :version
      t.string :transaction_id
      t.string :amount
      t.string :network
      t.string :transaction_descriptor
      t.string :merchant
      t.string :raw_message

      t.timestamps
    end
  end
end
