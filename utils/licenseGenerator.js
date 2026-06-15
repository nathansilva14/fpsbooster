function generateLicense(){

    const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let key = "FPS-";

    for(let i=0;i<4;i++){

        key += chars[
            Math.floor(
                Math.random() *
                chars.length
            )
        ];

    }

    key += "-";

    for(let i=0;i<4;i++){

        key += chars[
            Math.floor(
                Math.random() *
                chars.length
            )
        ];

    }

    key += "-";

    key +=
    new Date()
    .getFullYear();

    return key;
}

module.exports =
generateLicense;