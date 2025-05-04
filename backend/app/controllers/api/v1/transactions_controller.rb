class Api::V1::TransactionsController < ApplicationController
  def index
    render json: { message: "Hello from Rails!" }
  end

  def process_transaction
    input = params[:newTransaction]
    transaction_data = parse_transaction_string(input.split(//))

    res = {
      "version": "0.1",
      "transaction_id": SecureRandom.uuid,
      "amount": "#{transaction_data[:amount]}",
      "network": "#{transaction_data[:network]}",
      "transaction_descriptor": "#{transaction_data[:transaction_descriptor]}",
      "merchant": "#{transaction_data[:merchant]}"
    }

    render json: { last_transaction: res}, status: :ok
  end


  private 

  def parse_transaction_string(input)
    result = {}

    loops = 3

    while loops >= 1 do
      tag = input.slice!(0)
      length = input.slice!(0, 2).join.to_i

      if tag == "1"
        result[:network] = input.slice!(0, length).join
      end

      if tag == "2" 
        result[:amount] = input.slice!(0, length).reject { |x| x == "."}.join
      end

      if tag == "3"
        result[:merchant] = input.slice!(0, length).first(10).join
      end

      loops = loops - 1
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


  ## end of controller
end
