export const TGConfig = {
	debug: false,
	extradetail_display: true,
	max_history_length: 40,
	client_options: {
		musicVolume: 0.7,
		soundVolume: 1,
		output: {
			textSize: 2,
			trimLines: 500,
		},
		log: {
			enabled: true,
			save: false,
		}
	},
	output_size_options: [
		{
			name: 'Piccolissimo',
			class: 'size-xs'
		},
		{
			name: 'Piccolo',
			class: 'size-s'
		},
		{
			name: 'Medio',
			class: 'size-m'
		},
		{
			name: 'Grande',
			class: 'size-l'
		},
		{
			name: 'Grandissimo',
			class: 'size-xl'
		},
		{
			name: 'Gigantesco',
			class: 'size-xxl'
		},
		{
			name: 'Enorme',
			class: 'size-xxxl'
		}
	]
}