require 'rails_helper'

RSpec.describe Api::V1::TransactionsController, type: :request do
  describe 'POST /processtransaction' do
    let(:valid_transaction_string) { "309SMAINFRMR108DISCOVER2070100.95" }

    context 'when the context is valid' do
      it 'returns a successful response' do
        post '/api/v1/processtransaction', params: { newTransaction: valid_transaction_string}
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when the context is invalid' do
      it 'returns a bad response' do
        post '/api/v1/processtransaction', params: { newTransaction: nil}
        expect(response).to have_http_status(:bad_request)
      end
    end
  end
end