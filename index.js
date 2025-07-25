let progressPath;
let pathLength = 0;

const middleHeight = 100;

window.addEventListener('DOMContentLoaded', () => {

    // Ball Scroller setup
    const percentTrack = document.getElementById('percentTrack');
    if (percentTrack) {
        for (let i = 0; i <= 100; i++) {
            const span = document.createElement('span');
            span.textContent = i + '%';
            percentTrack.appendChild(span);
        }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    handleScroll();
	handleResize();
});

function pathToString(path) {
    let d = `M ${path[0][0]} ${path[0][1]} `;
    for (let i = 0; i < path.length; i++) {
      d += `C ${path[i][2]} ${path[i][3]}, ${path[i][4]} ${path[i][5]}, ${path[i][6]} ${path[i][7]} `;
    }
    return d.trim();
}

function handleResize() {
	const height = window.innerHeight;
	const svgScroller = document.getElementById('svgScroller');
	const svgScrollerPath = document.getElementById('progress-path');
	const r = 20;
	const path = [
		[90,0, 90,0, 90,((height/2)-50), 90,((height/2)-50)],
		[90,((height/2)-50), 90,((height/2)-50), 10+r,((height/2)-50)-r, 10,((height/2)-50)],
		[10,((height/2)-50), 10-r,((height/2)-50)+r, 10-r,((height/2)+50)-r, 10,((height/2)+50)],
		[10,((height/2)+50), 10+r,((height/2)+50)+r, 90,((height/2)+50), 90,((height/2)+50)],
		[90,((height/2)+50), 90,((height/2)+50), 90,height, 90,height]
	];
	
	svgScroller.setAttribute('viewBox', `0 0 100 ${height}`);
	svgScrollerPath.setAttribute('d', pathToString(path));
	
	//SVG Scroller update
	const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);
	const progressPath = document.getElementById('progress-path');
	const pathLength = progressPath.getTotalLength();
	progressPath.style.strokeDasharray = `${pathLength * scrollPercent} ${10*pathLength}`;
    progressPath.style.strokeDashoffset = -pathLength/2+(pathLength/2)*scrollPercent;
}
// Scroller
function handleScroll() {

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);
	
	//SVG Scroller update
	const progressPath = document.getElementById('progress-path');
	const pathLength = progressPath.getTotalLength();
	progressPath.style.strokeDasharray = `${pathLength * scrollPercent} ${10*pathLength}`;
    progressPath.style.strokeDashoffset = -pathLength/2+(pathLength/2)*scrollPercent;
	
    // Ball Scroller update
    const percentTrack = document.getElementById('percentTrack');
    if (percentTrack) {
        const nearestPercent = Math.round(scrollPercent * 100);
        percentTrack.style.transform = `translateY(-${nearestPercent * 80}px)`;
    }
}