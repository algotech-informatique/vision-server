import { Observable } from 'rxjs';
import * as os from 'os';

export class ObservableQueue {

    private queue: Observable<any>[] = [];
    private maxConcurency = 200;

    constructor() {
       this.maxConcurency = 200 / (+(os.cpus().length) + 1);
    }

    push<T>(original: Observable<T>): Observable<T> {
        this.queue.push(original);

        const execute = (observer) => {
            original.subscribe((...args) => {
                observer.next(...args);
                observer.complete();
                this.queue.shift();
            }, (err) => {
                observer.error(err);
                observer.complete();
                this.queue.shift();
            });
        }

        const wrapper = new Observable<T>(observer => {
            if (this.queue.indexOf(original) < this.maxConcurency) {
                execute(observer);
            } else {
                // retry each 100ms
                const intervalId = setInterval(() => {
                    if (this.queue.length > 0) {
                        
                        if (this.queue.indexOf(original) < this.maxConcurency) {
                            clearInterval(intervalId);
                            execute(observer);
                        }
                    } else {
                    }
                }, 100);
            }
        });

        return wrapper;
    }
}