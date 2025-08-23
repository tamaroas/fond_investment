export type ContratType = {
    id: string,
    description: string,
    duree: number,
    dateSignatureContrat: string,
    dateFinContrat: string,
    nbreRenouvellement: number,
    montantVersementInitial: number,
    montantVersementPeriodique: number,
    datePremierVersementPeriodique: number,
    typeVersement: string,
    typeContrat: {
        publicId: string,
        nom: string,
        description: string,
        duree: number,
        dureeRenouvellement: number,
        tauxInteret: number,
        fraisOuverture: number,
        fraisCloture: number,
        fraisRenouvellement: number,
        fraisVersement: number,
        fraisRetrait: number,
        fraisFiscalite: number,
        tauxFraisGestion: number,
        montantMinVersement: number,
        montantMaxVersement: number,
        montantRetraitMax: number,
        fraisRetraitAvantEcheance: number,
        typeVersement: string,
        hasBeneficiare: boolean,
        hasSignataires: boolean,
        type: string,
        renouvelable: boolean
    },
    signataires: any[],
    beneficiaires: any[],
    soldeContrat: {
        id: string,
        solde: number
    }
}
    