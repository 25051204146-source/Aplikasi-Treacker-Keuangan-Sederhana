let transactions = [];
let editId = null;

function generateId() {
    return +new Date();
}

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");

const form = document.getElementById("transactionForm");

const SearchInput = document.getElementById("searchTransactionFormTitleInput");

function updateDashboard(){
    const totalIncome = transactions
      .filter (t => t.type === "income")
      .reduce ((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter ( t => t.type === "expense")
      .reduce ((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    document.querySelector(
        ".tracker-summary__balance-amount"
    ).textContent = `Rp ${balance}`;

    document.querySelector(
        ".tracker-summary__stat-amount--income"
    ).textContent = `Rp ${totalIncome}`;

    document.querySelector(
        ".tracker-summary__stat-amount--expense"
    ).textContent = `Rp ${totalExpense}`;
}

document.addEventListener(
    "transaction:updated",
    () => {
        renderTransactions();
        updateDashboard();
    }
);

function renderTransactions(data = transactions) {
    incomeList.innerHTML = "";
    expenseList.innerHTML = "";

    data.forEach(transaction => {
        const card = document.createElement("div");

        card.setAttribute(
            "data-testid",
            "transactionItem"
        );

        const title = document.createElement("h3");

        title.textContent = transaction.title;

        title.setAttribute(
            "data-testid",
            "transactionItemTitle"
        );

        const amount = document.createElement("p");
        amount.textContent =
          `Nominal : Rp ${transaction.amount}`;

        amount.setAttribute(
            "data-testid",
            "transactionItemAmount"
        );

        const date = document.createElement("p");
        date.textContent = 
          `Tanggal : ${transaction.date}`;

        date.setAttribute(
            "data-testid",
            "transactionItemDate"
        );

        const type = document.createElement("p");
        type.textContent = 
          `Klasifikasi : ${transaction.type}`;

        type.setAttribute(
            "data-testid",
            "transactionItemType"
        );

        const deleteButt = document.createElement("button");

        deleteButt.textContent = "Delete";

        deleteButt.setAttribute(
            "data-testid",
            "transactionItemDeleteButton"
        );

        deleteButt.addEventListener("click", () => {
            transactions = transactions.filter(
                t => t.id !== transaction.id
            );

            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );

        
        document.dispatchEvent(new Event("transaction:updated"));

        });

        const ChangeTypeButt = document.createElement("button");

        ChangeTypeButt.textContent = "Change Type";

        ChangeTypeButt.setAttribute(
            "data-testid",
            "transactionItemEditTypeButton"
        );

        ChangeTypeButt.addEventListener("click", ()=> {
           transaction.type = 
             transaction.type === "income"
             ? "expense"
             : "income";

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
            );

        document.dispatchEvent(new Event("transaction:updated"));

        });

        const EditButt = document.createElement("button");

        EditButt.textContent = "Edit";
        EditButt.addEventListener( "click", () => {
            document.getElementById("transactionFormTitleInput").value = transaction.title;
            document.getElementById("transactionFormAmountInput").value = transaction.amount;
            document.getElementById("transactionFormDateInput").value = transaction.date;
            document.getElementById("transactionFormTypeSelect").value = transaction.type;

            editId = transaction.id;
        });

        card.appendChild(title);
        card.appendChild(amount);
        card.appendChild(date);
        card.appendChild(type);
        card.appendChild(deleteButt);
        card.appendChild(ChangeTypeButt);
        card.appendChild(EditButt);

        if (transaction.type === "income") {
            incomeList.appendChild(card);
        } else {
            expenseList.appendChild(card);
        }
        });
}

SearchInput.addEventListener("input", ()=> {
            const keyword = SearchInput.value.toLowerCase();

            const filteredTransactions = transactions.filter(transaction => transaction.title
                .toLowerCase()
                .includes(keyword)
            );

            renderTransactions(filteredTransactions);
        });

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("transactionFormTitleInput").value;
    const amount = Number(document.getElementById("transactionFormAmountInput").value);
    const date = document.getElementById("transactionFormDateInput").value;
    const type = document.getElementById("transactionFormTypeSelect").value;

    if (title === ""){
        alert("Keterangan tidak boleh kosong");
        return;
    }

    if (amount < 1){
        alert ("Nominal minimal 1");
        return;
    }

    const newTransaction = {
        id : generateId(),
        title,
        amount,
        date,
        type
    };

    if (editId === null){
        transactions.push(newTransaction);

    } else {
        const transactionToEdit = transactions.find( t => t.id === editId);

        transactionToEdit.title = title;
        transactionToEdit.amount = amount;
        transactionToEdit.date = date;
        transactionToEdit.type = type;

        editId = null;

    }

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    document.dispatchEvent(new Event("transaction:updated"));

    //renderTransactions();
    //updateDashboard();

    form.reset();

});

const savedTransactions =
    localStorage.getItem("transactions");

    if (savedTransactions){
       transactions =
       JSON.parse(savedTransactions); }

    document.dispatchEvent(new Event("transaction:updated"));