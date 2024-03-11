function Eixos(imgDataEixos, numeroInteiro) {
    const teste= true;
    if (teste) {
        let dataEixos = imgDataEixos.data;

        let posicoesInteiros = [];

        let cont = qtdInteiros * (-1);
        for (i = 0; i < ((qtdInteiros * 2) + 1); i++) {
            posicoesInteiros[i] = numeroInteiro * cont;
            cont++;
        }

        console.log(posicoesInteiros);

        let tamanhoEixo = 2;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                let px = (x + y * width) * 4;
                if ((x > centro - tamanhoEixo && x < centro + tamanhoEixo) ||
                    (y > centro - tamanhoEixo && y < centro + tamanhoEixo)) {
                    dataEixos[px] = 100;
                    dataEixos[px + 1] = 100;
                    dataEixos[px + 2] = 100;
                    dataEixos[px + 3] = 255;
                }

                posicoesInteiros.forEach(posicao => {
                    let xCentro = x - centro;
                    if ((xCentro > posicao - tamanhoEixo && xCentro < posicao + tamanhoEixo) && (y > centro - 10 && y < centro + 10)) {
                        dataEixos[px] = 100;
                        dataEixos[px + 1] = 100;
                        dataEixos[px + 2] = 100;
                        dataEixos[px + 3] = 255;
                        //console.log("Posção em: " + posicao + "px");
                    }

                    let yCentro = y - centro;
                    if ((yCentro > posicao - tamanhoEixo && yCentro < posicao + tamanhoEixo) && (x > centro - 10 && x < centro + 10)) {
                        dataEixos[px] = 100;
                        dataEixos[px + 1] = 100;
                        dataEixos[px + 2] = 100;
                        dataEixos[px + 3] = 255;
                        //console.log("Posção em: " + posicao + "px");
                    }
                });
            }
        }
    }


    //Coloca uma barra vertical de 10px de altura em cada numero inteiro


    //eixosContext2d.putImageData(ImgDataEixos, 0, 0);

    //console.log("Eixos desenhados: " + numeroInteiro);

    return imgDataEixos;
}


function getZvalue(a, b, f) {

    let ret = { 'z': { real: a, imag: b } };
    ret = { 'z': f(ret) };
    return ret['z'];
}

