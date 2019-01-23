export interface IObjPersDesc {
    base: string;
    details: string;
    equip: any;
}

export interface IObjPersObjcont {
    title: string;
    list: any[];
}

export interface Eqcont {
    cntnum: number;
    cond: number;
    condprc: number;
    desc: string;
    eq: any[];
    icon: number;
    mrn: number[];
    type: string;
    wgt: number;
}

export interface IObjPersEqcont {
    title: string;
    list: Eqcont[];
}

export interface IObjPerson {
    cmd1: any;
    cmd2: any;
    desc: IObjPersDesc;
    eqcont: IObjPersEqcont;
    objcont: IObjPersObjcont;
    icon: number;
    num: number;
    title: string;
}
