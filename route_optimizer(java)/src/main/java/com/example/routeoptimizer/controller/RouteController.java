package com.example.routeoptimizer.controller;

import com.example.routeoptimizer.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/route")
    public String findRoute(@RequestParam String source, @RequestParam String destination, Model model) {
        var result = routeService.findShortestPath(source, destination);
        model.addAttribute("path", result.path());
        model.addAttribute("distance", result.distance());
        return "index";
    }
}
