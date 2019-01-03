export interface Desc {
	repeatlast: boolean;
}

export interface List {
	type: string;
	icon: number;
	cond: number;
	condprc: number;
	mrn: number[];
	desc: string;
	mvprc: number;
}

export interface Perscont {
	list: List[];
}

export interface Room {
	image: string;
	ver: number;
	icon: number;
	title: string;
	desc: Desc;
	perscont: Perscont;
}
