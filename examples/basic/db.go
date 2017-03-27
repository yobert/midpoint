package main

import (
	"sync"
	"time"
	"fmt"
)

type DB struct {
	mu sync.Mutex

	next int

	Jobs map[string]*Job
}

func NewDB() *DB {
	return &DB{
		Jobs: make(map[string]*Job),
	}
}

func (db *DB) Lock() {
	db.mu.Lock()
}

func (db *DB) Unlock() {
	db.mu.Unlock()
}

func (db *DB) Next() string {
	db.next++
	return fmt.Sprintf("id_%d", db.next)
}

type Job struct {
	ID string

	Title string
	Created time.Time
	Modified time.Time
}

