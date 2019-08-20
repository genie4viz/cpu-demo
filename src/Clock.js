import React, { useRef, useEffect } from 'react';

const SPEED = 0.003 / Math.PI;
const FRAMES = 10;

export default function Clock() {

    const faceRef = useRef();
    const arcGroupRef = useRef();
    const clockHandRef = useRef();

    const paths = new Array(FRAMES);
    for (let i = 0; i < FRAMES; i++) {
        paths.push(<path className="arcHand" key={i} />);
    }

    let frame = null, hitCounter = 0, rotation = 0, t0 = Date.now(), arcs = [];

    const animate = () => {

        const now = Date.now();
        const td = now - t0;
        rotation = (rotation + SPEED * td) % (2 * Math.PI);
        t0 = now;

        arcs.push({ rotation: rotation, td });

        let lx, ly, tx, ty;
        if (arcs.length > FRAMES) {
            arcs.forEach(({ rotation, td }, i) => {
                lx = tx;
                ly = ty;
                const r = 145;
                tx = 155 + r * Math.cos(rotation);
                ty = 155 + r * Math.sin(rotation);
                const bigArc = SPEED * td < Math.PI ? '0' : '1';
                const path = `M${tx} ${ty}A${r} ${r} 0 ${bigArc} 0 ${lx} ${ly}L155 155`;
                const hue = 120 - Math.min(120, td / 4);
                const colour = `hsl(${hue}, 100%, ${60 - i * (30 / FRAMES)}%)`;
                if (i !== 0) {
                    const arcEl = arcGroupRef.current.children[i - 1];
                    arcEl.setAttribute('d', path);
                    arcEl.setAttribute('fill', colour);
                }
            });
            clockHandRef.current.setAttribute('d', `M155 155L${tx} ${ty}`);
            arcs.shift();
        }

        if (hitCounter > 0) {
            faceRef.current.setAttribute(
                'fill',
                `hsla(0, 0%, ${this.hitCounter}%, 0.95)`
            );
            hitCounter -= 1;
        } else {
            hitCounter = 0;
            faceRef.current.setAttribute('fill', 'hsla(0, 0%, 5%, 0.95)');
        }

        frame = requestAnimationFrame(animate);
    };

    useEffect(() => {
        frame = requestAnimationFrame(animate);
        if (faceRef.current) {
            faceRef.current.addEventListener('click', handleClick);
        }

        return () => {
            faceRef.current.removeEventListener('click', handleClick);
            if (frame) {
                cancelAnimationFrame(frame);
            }
        };
    }, []);

    useEffect(() => {
        console.log('componentDidUpdate()', faceRef.current);
    });

    const handleClick = e => {
        e.stopPropagation();
        hitCounter = 50;
    };

    return (
        <div className="stutterer">
            <svg height="310" width="310">
                <circle
                    className="clockFace"
                    onClick={handleClick}
                    cx={155}
                    cy={155}
                    r={150}
                    ref={faceRef}
                />
                <g ref={arcGroupRef}>{paths}</g>
                <path className="clockHand" ref={clockHandRef} />
            </svg>
        </div>
    );
}