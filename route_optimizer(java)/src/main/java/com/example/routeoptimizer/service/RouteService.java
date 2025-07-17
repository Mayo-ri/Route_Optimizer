package com.example.routeoptimizer.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RouteService {

    private final Map<String, Map<String, Integer>> graph = Map.of(
        "A", Map.of("B", 5, "C", 2),
        "B", Map.of("D", 1),
        "C", Map.of("B", 8, "D", 7),
        "D", Map.of("E", 3),
        "E", Map.of()
    );

    public record Result(List<String> path, int distance) {}

    public Result findShortestPath(String start, String end) {
        PriorityQueue<Node> queue = new PriorityQueue<>(Comparator.comparingInt(n -> n.cost));
        queue.add(new Node(start, 0, new ArrayList<>()));
        Set<String> visited = new HashSet<>();

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            if (visited.contains(current.city)) continue;
            visited.add(current.city);
            List<String> path = new ArrayList<>(current.path);
            path.add(current.city);
            if (current.city.equals(end)) {
                return new Result(path, current.cost);
            }
            Map<String, Integer> neighbors = graph.getOrDefault(current.city, new HashMap<>());
            for (var neighbor : neighbors.entrySet()) {
                queue.add(new Node(neighbor.getKey(), current.cost + neighbor.getValue(), path));
            }
        }
        return new Result(Collections.emptyList(), 0);
    }

    private record Node(String city, int cost, List<String> path) {}
}
