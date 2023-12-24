<?php

namespace App\Iterators;

use Generator;
use Iterator;
use function App\Providers\rocketDump;

class WorksIterator implements Iterator  {
    private array $works;

    public function __construct(array $works) {
        rocketDump($works, 'info', [__FUNCTION__,__FILE__,__LINE__]);
        $this->works = $works;
    }

    public function current(): mixed {
        return current($this->works);
    }

    public function key(): int {
        return key($this->works);
    }

    public function next(): void {
        next($this->works);
    }

    public function rewind(): void {
        reset($this->works);
    }

    public function valid(): bool {
        return key($this->works) !== null;
    }

    public function generator(): Generator {
        foreach ($this->works as $work) {
            yield $work;
        }
    }
}
