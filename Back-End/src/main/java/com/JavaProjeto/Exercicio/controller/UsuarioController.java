package com.JavaProjeto.Exercicio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.JavaProjeto.Exercicio.business.UsuarioService;
import com.JavaProjeto.Exercicio.infrastruture.entity.Usuario;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

	private final UsuarioService usuarioService;

	@PostMapping
	public ResponseEntity<Usuario> salvaUsuario(@RequestBody Usuario usuario) {
		return ResponseEntity.ok(usuarioService.salvaUsuario(usuario));
	}

	@GetMapping
	public ResponseEntity<List<Usuario>> buscaTodosUsuarios() {
		return ResponseEntity.ok(usuarioService.buscaTodosUsuarios());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Usuario> atualizaUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
		return ResponseEntity.ok(usuarioService.atualizaUsuario(id, usuario));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
		usuarioService.deletaUsuarioPorId(id);
		return ResponseEntity.noContent().build();
	}

}