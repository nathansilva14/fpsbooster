async function loadAdmin(){

    const stats =
    await fetch(
        "/auth/admin/stats"
    );

    const data =
    await stats.json();

    document.getElementById(
        "totalUsers"
    ).innerText =
    data.users;

    document.getElementById(
        "totalLicenses"
    ).innerText =
    data.licenses;

    document.getElementById(
        "totalPayments"
    ).innerText =
    data.payments;

    document.getElementById(
        "revenue"
    ).innerText =
    "R$ " + data.revenue;

    const rankRes =
    await fetch(
        "/auth/ranking"
    );

    const ranking =
    await rankRes.json();

    let html = "";

    ranking.forEach(
        (u,index)=>{

        html += `

        <p>

        #${index+1}
        ${u.name || "Sem Nome"}

        -

        ${u.referrals}

        indicações

        </p>

        `;

    });

    document.getElementById(
        "ranking"
    ).innerHTML =
    html;

}

loadAdmin();