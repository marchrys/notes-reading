function findSingle(objArray, id){
    let singleItem;
    objArray.forEach(function(item){
        if(item.id == id){
            singleItem = item;
        }
    });
    return singleItem;
}
