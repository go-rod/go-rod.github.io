package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"

	_ "github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/utils"
	"github.com/ysmood/got"
)

func TestCheckCode(t *testing.T) {
	g := got.T(t)

	g.E(os.RemoveAll("tmp"))

	g.E(filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		g.E(err)

		if info.IsDir() || path[0] == '.' || strings.HasPrefix(path, "i18n") || filepath.Ext(path) != ".md" {
			return nil
		}

		b, err := os.ReadFile(path)
		g.E(err)
		return checkGoCode(g, path, string(b))
	}))

	defer func() {
		if e := recover(); e != nil {
			t.Error(e)
		}
	}()

	utils.ExecLine(false, "go run golang.org/x/tools/cmd/goimports@latest -w tmp")
	utils.ExecLine(false, "go run github.com/ysmood/golangci-lint@latest")
}

var count = 0

func checkGoCode(g got.G, path, body string) error {
	reg := regexp.MustCompile("(?s)```go\r?\n(.+?)```")

	for _, m := range reg.FindAllStringSubmatch(body, -1) {
		code := strings.TrimSpace(m[1])
		if strings.HasPrefix(code, "package ") {
		} else if strings.Contains(code, "func ") {
			code = "package main\n" + vars(code) + code
		} else {
			code = "package main\n" + vars(code) + "func main() {\n" + code + "\n}"
		}
		p := filepath.FromSlash(fmt.Sprintf("tmp/code-check/c%03d/main.go", count))
		count++

		code = "// Source markdown file: " + path + "\n\n" + code

		g.WriteFile(p, []byte(code))
	}

	return nil
}

func vars(code string) string {
	vars := ""
	if strings.Contains(code, "page.") && !strings.Contains(code, "page :=") {
		vars += "var page *rod.Page\n"
	}
	if strings.Contains(code, "browser.") && !strings.Contains(code, "browser :=") {
		vars += "var browser *rod.Browser\n"
	}
	return vars
}
