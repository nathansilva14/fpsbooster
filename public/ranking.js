async function loadRanking(){

    const res =
    await fetch(
        "/auth/ranking"
    );

    const ranking =
    await res.json();

    let html = "";

    ranking.forEach(
        (user,index)=>{

        html += `

        <div class="card">

            <h2>
            #${index+1}
            </h2>

            <h3>
            ${user.name || "Sem Nome"}
            </h3>

            <p>
            Plano:
            ${user.plan}
            </p>

            <p>
            Indicações:
            ${user.referrals}
            </p>

        </div>

        `;

    });

    document
    .getElementById(
        "ranking"
    )
    .innerHTML =
    html;

}

loadRanking();