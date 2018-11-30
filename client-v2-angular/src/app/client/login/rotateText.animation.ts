import { trigger, stagger, transition, style, query, animate} from '@angular/animations';

export const rotateTextAnimation =

trigger('fadeTextAnimation', [
			transition('* => *', [
				query('.phrase', style({ opacity: 0 })),
				query('.phrase', stagger('4000ms', [
					animate('1500ms 1.2s ease-out', style({ opacity: 1}))
				])),

			]),
	]);