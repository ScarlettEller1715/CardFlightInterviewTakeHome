class Api::V1::TransactionsController < ApplicationController

  def index
    transactions = Transaction.all
    render json: transactions
  end

  def process_transaction
    input = params[:newTransaction]

    ## Check to ensure input isn't blank
    unless input.present?
      return render json: { error: "No transaction entered" }, status: :bad_request
    end

    processed_transaction = create_transaction(input)

    render json: { last_transaction: processed_transaction}, status: :ok
  end

  private 

  def create_transaction(input)
    transaction_data = parse_transaction_string(input.split(//))

    ## Check to ensure input is valid
    if transaction_data.values_at(:amount, :network, :transaction_descriptor, :merchant).any?(&:blank?)
      return render json: { error: "Transaction Data Not Valid" }, status: :bad_request
    end

    res = {
      "version": "0.1",
      "transaction_id": SecureRandom.uuid,
      "amount": "#{transaction_data[:amount]}",
      "network": "#{transaction_data[:network]}",
      "transaction_descriptor": "#{transaction_data[:transaction_descriptor]}",
      "merchant": "#{transaction_data[:merchant]}",
      "raw_message": "#{input}"
    }

    Transaction.create!(
      version: res[:version],
      transaction_id: res[:transaction_id],
      amount: res[:amount],
      network: res[:network],
      transaction_descriptor: res[:transaction_descriptor],
      merchant: res[:merchant],
      raw_message: input
    )

    res
  end

  def parse_transaction_string(input)
    result = {}

    loops = 3

    while loops >= 1 do
      tag = input.slice!(0)
      length = input.slice!(0, 2).join.to_i

      case tag
      when "1"
        result[:network] = input.slice!(0, length).join
        loops -= 1
      when "2"
        result[:amount] = input.slice!(0, length).reject { |x| x == "." }.join
        loops -= 1
      when "3"
        result[:merchant] = input.slice!(0, length).first(10).join
        loops -= 1
      end
    end

    transaction_descriptor_data = {
      network: result[:network], 
      descriptor: result[:network] == "VISA" ? result[:amount] : result[:network].split(//).first(2).join
    }

    result[:transaction_descriptor] = create_transaction_descriptor(transaction_descriptor_data)

    result
  end

  def create_transaction_descriptor(data)
    descriptor_array = data[:descriptor].split(//)

    if data[:network] == "VISA"
      while descriptor_array.length < 8 do
        descriptor_array.unshift("0")
      end
    else
      while descriptor_array.length < 8 do
        descriptor_array.append("F")
      end
    end 

    descriptor_array.join
  end

end
