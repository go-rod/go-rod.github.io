package main

import (
	"log"
	"net"
	"net/http"

	"github.com/go-rod/rod/lib/launcher"
)

func main() {
	l, err := net.Listen("tcp4", ":0")
	if err != nil {
		log.Fatal(err)
	}

	go launcher.Open("http://" + l.Addr().String())

	_ = http.Serve(l, http.FileServer(http.Dir(".")))
}
