export abstract class MockBuilder<T> {
    build(): T {
        return this as unknown as T;
    }
}