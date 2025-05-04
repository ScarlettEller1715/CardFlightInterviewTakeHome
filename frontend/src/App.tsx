import './App.css';
import React, { useEffect, useState } from "react";

type Transaction = {
  amount: string; 
  network: string;
  transaction_descriptor: string;
  transaction_id: string;
  version: string; 
  merchant: string;
  raw_message: string;
};

function App() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState("")
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/transaction")
      .then((res) => res.json())
      .then((data) => setAllTransactions(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/v1/processtransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newTransaction})
      });

      const data = await res.json();

      if (res.ok) {
        setLastTransaction(data.last_transaction)
        setAllTransactions([data.last_transaction, ...allTransactions])
        setNewTransaction("")
      } else {
        alert("Transaction does not follow template specifications, please try again.")
      }
    } catch (error) {
      console.log("hit")
      alert(`Error submitting transaction: ${error}`)
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='transactionInput'>Enter Transaction Data:</label>
          <input id="transactionInput" 
            type="text"
            value={newTransaction}
            onChange={(e) => setNewTransaction(e.target.value)} 
            />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h2>Previous Transaction</h2>
        {lastTransaction === null ? <h4>Please Create a Transaction</h4> 
          : 
          <div> 
            <h3>Information about your Previous Transaction</h3>
            <p>Amount: {lastTransaction?.amount}</p>
            <p>Network: {lastTransaction?.network}</p>
            <p>Descriptor: {lastTransaction?.transaction_descriptor}</p>
            <p>Merchant: {lastTransaction?.merchant}</p>
            <p>Transaction ID: {lastTransaction?.transaction_id}</p>
            <p>Version: {lastTransaction?.version}</p>
            <p>Raw Message: {lastTransaction?.raw_message}</p>
          </div>
        }
      </div>
      <hr />
      <div>
        <h2>Recorded Transactions</h2>
        {allTransactions.length === 0 ? <h4>No Transactions Recorded</h4>
          : 
          <div>
            {allTransactions.map((transaction: Transaction) => {
              return (
                <div>
                  <h4>Merchant: {transaction.merchant}</h4>
                  <p>Amount: {transaction.amount}</p>
                  <p>Network: {transaction.network}</p>
                  <p>Descriptor: {transaction.transaction_descriptor}</p>
                  <p>Transaction ID: {transaction.transaction_id}</p>
                  <p>Version: {transaction.version}</p>
                  <p>Raw Message: {transaction.raw_message}</p>
                </div>
              )
            })}
          </div>
          }
      </div>
    </div>
  );
}

export default App;