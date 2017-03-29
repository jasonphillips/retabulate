export default function getDataset(name) {
    return new Promise((resolve, reject) => {
        fetch(`data/${name}.json`).then((response) => {
           response.json().then((data) => {
               resolve(data.records)
           });
        }).catch((e) => {
            console.log(e);
        });
    });
}
