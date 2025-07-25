window.addEventListener('DOMContentLoaded', () => {
//circling nav links
	const circle = document.querySelectorAll('.circle');
	circle.forEach(el => {
	const circling = RoughNotation.annotate(el, { type: 'circle', color: '#0b0', padding: 5 });
	circling.show();
	});
//underline
	const underline = document.querySelectorAll('.underline');
	underline.forEach(el =>{
	const underliner = RoughNotation.annotate(el, { type: 'underline', color: 'green', padding: 0 });
	underliner.show();
	});
//box
	const box = document.querySelectorAll('.box');
	box.forEach(el =>{
	const boxing = RoughNotation.annotate(el, { type: 'box', color: '#000', padding: -15 });
	boxing.show();
	});
})