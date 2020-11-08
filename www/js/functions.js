function percentage(number1, number2){
    let pcent;

    if(number2 === 0){
        pcent = 0;
    }else{
        pcent = Math.round((number1 * 100) / number2);
    }

    return pcent;
}