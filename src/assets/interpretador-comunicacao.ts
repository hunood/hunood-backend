class InterpretadorComunicacao {
    private promise;

    constructor(promise: Promise<any>) {
        this.promise = promise;
    }

    private callbackSucesso = (callback?: any) => {
        this.promise.then((response) => {
            callback(response);
        });
        return this;
    }

    private callbackErro =  (callback?: any) => {
        this.promise.catch((erro) => {
            if (erro.message) {
                callback(erro);
            }
        });
        return this;
    }

    sucesso = this.callbackSucesso;
    erro = this.callbackErro;
}

export const interpretar = (promise: Promise<any>) => new InterpretadorComunicacao(promise);
