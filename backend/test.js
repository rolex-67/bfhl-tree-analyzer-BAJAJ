fetch('http://localhost:5000/bfhl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        data: [
            "A->B", "A->C", "B->D", "C->E", "E->F",
            "X->Y", "Y->Z", "Z->X",
            "P->Q", "Q->R",
            "G->H", "G->H", "G->I",
            "hello", "1 ->2", "A->"
        ]
    })
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(console.error);
