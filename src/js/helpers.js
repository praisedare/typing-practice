class Helper {
    createStylesheet() {}

    importStylesheet(href) {
        let $s = document.createElement('link');
        $s.rel = 'stylesheet';
        $s.href = href;

        document.head.append($s);
    }
}
