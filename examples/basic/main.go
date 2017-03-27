package main

import (
	"encoding/json"
	"sort"
	"net/http"
	"time"
	"log"
	"math/rand"
)

var base_page = []byte(`
<html>
<head>
<link rel="stylesheet" href="/assets/main.css"/>
<script src="/assets/main.js"></script>
<body onload="main()">
<div id="main"></div>
</body>
</html>

`)

func main() {
	addr := ":8080"

	db := NewDB()

	for i := 0; i < 10; i++ {
		id := db.Next()
		db.Jobs[id] = &Job{
			ID: id,
			Title: "a nice job",
			Created: time.Now(),
			Modified: time.Now().Add(time.Hour * time.Duration(rand.Intn(365 * 24))),
		}
	}

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; encoding=UTF-8")
		w.Write(base_page)
	})

	json_handler("/v1/joblist/created", func() (interface{}, error) {
		db.Lock()
		defer db.Unlock()

		list := make([]*Job, len(db.Jobs))
		i := 0
		for _, v := range db.Jobs {
			list[i] = v
			i++
		}
		sort.Slice(list, func(i, j int) bool {
			if list[i].Created.Before(list[j].Created) {
				return true
			}
			return false
		})
		return list, nil
	})
	json_handler("/v1/joblist/modified", func() (interface{}, error) {
		db.Lock()
		defer db.Unlock()

		list := make([]*Job, len(db.Jobs))
		i := 0
		for _, v := range db.Jobs {
			list[i] = v
			i++
		}
		sort.Slice(list, func(i, j int) bool {
			if list[i].Modified.Before(list[j].Modified) {
				return true
			}
			return false
		})
		return list, nil
	})

	log.Println("Listening on HTTP", addr, "...")
	log.Fatal(http.ListenAndServe(addr, nil))
}

func json_handler(path string, handler func() (interface{}, error)) {
	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != path {
			http.NotFound(w, r)
			return
		}
		v, err := handler()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		j, err := json.Marshal(v)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.Header().Set("Content-Type", "application/json; encoding=UTF-8")
		w.Write(j)
	})
}

