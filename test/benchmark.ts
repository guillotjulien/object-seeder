import 'reflect-metadata';

import { performance } from 'perf_hooks';
import { TestTypes } from './fixtures/TestTypes';

/**
 * Execute callback N times and measure execution duration
 *
 * @param times Number of repetitions
 * @param title Benchmark title
 * @param exec Execution callback
 */
function bench(times: number, title: string, exec: (i: number) => void): void {
    const start = performance.now();

    for (let i = 0; i < times; i++) {
        exec(i);
    }

    const took = performance.now() - start;

    console.log(times, 'x benchmark', title, took, 'ms', took / times, 'per item');
}

bench(100000, 'Testing unmarshalling plain object into class', (i: number) => {
    new TestTypes({
        string: 'a',
        boolean: true,
        number: i,
        date: new Date(),
        someClasses: [
            {
                id: 1,
                name: 'test',
            },
            {
                id: 2,
                name: 'test',
            },
            {
                id: 3,
                name: 'test',
            },
        ],
        someClass: {
            id: 4,
            name: 'test',
        },
    });
});
