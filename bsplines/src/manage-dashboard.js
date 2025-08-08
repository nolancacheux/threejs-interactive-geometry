

function updateTable(Meshes){

    clearTable()
    for(let i = 0;i<Meshes.length;i++){
        imesh = Meshes[i]
        let x = Math.round(imesh.position.x*100)/100
        let y = Math.round(imesh.position.y*100)/100
        let p = "<tr><td>"+imesh.userData.id+"</td><td>"+x+"</td><td>"+y+"</td></tr>"
        $( "#points" ).append( p );
    }


}

function clearTable(){
    $( "#points" ).empty();
    $("#points").append("<tr><td>id</td><td>X</td><td>Y</td></tr>")
}


