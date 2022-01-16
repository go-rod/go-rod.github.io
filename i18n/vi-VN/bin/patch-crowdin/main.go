package main

import (
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

func main() {
	reg := regexp.MustCompile(`\s*<unk>\s*`)

	err := filepath.Walk(".", func(path string, info fs.FileInfo, err error) error {
		if path[0] == '.' || !strings.HasSuffix(path, ".md") {
			return nil
		}

		s, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		s = reg.ReplaceAll(s, []byte(""))

		return os.WriteFile(path, s, 0)
	})
	if err != nil {
		log.Fatalln(err)
	}
}
