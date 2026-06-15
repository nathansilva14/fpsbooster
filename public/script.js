async function buy(plan){

    const email =
    localStorage.getItem(
        "email"
    );

    if(!email){

        alert(
            "Faça login primeiro"
        );

        window.location.href =
        "login.html";

        return;

    }

    const res =
    await fetch(

        "/payment/create",

        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                email,
                plan

            })

        }

    );

    const data =
    await res.json();

    alert(

        "Pagamento criado!\n\n" +

        "ID: " +
        data.paymentId +

        "\nValor: R$ " +
        data.amount

    );

}