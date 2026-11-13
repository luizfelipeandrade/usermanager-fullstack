package com.JavaProjeto.Exercicio.business;

import java.util.List;

import org.springframework.stereotype.Service;

import com.JavaProjeto.Exercicio.infrastruture.entity.Usuario;
import com.JavaProjeto.Exercicio.infrastruture.entity.exceptions.ConflictException;
import com.JavaProjeto.Exercicio.infrastruture.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;

	public Usuario salvaUsuario(Usuario usuario) {
		emailExiste(usuario.getEmail());
		return usuarioRepository.save(usuario);
	}

	public List<Usuario> buscaTodosUsuarios() {
		return usuarioRepository.findAll();
	}

	public Usuario buscaUsuarioEmail(String email) {
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ConflictException("Email não encontrado: " + email));
	}

	public Usuario atualizaUsuario(Long id, Usuario usuarioAtualizado) {
		Usuario usuarioExistente = usuarioRepository.findById(id)
				.orElseThrow(() -> new ConflictException("Usuário não encontrado com ID: " + id));

		usuarioExistente.setNome(usuarioAtualizado.getNome());
		usuarioExistente.setEmail(usuarioAtualizado.getEmail());
		usuarioExistente.setProfissao(usuarioAtualizado.getProfissao());

		if (usuarioAtualizado.getEnderecos() != null) {
			usuarioExistente.getEnderecos().clear();
			usuarioExistente.getEnderecos().addAll(usuarioAtualizado.getEnderecos());
		}

		if (usuarioAtualizado.getTelefones() != null) {
			usuarioExistente.getTelefones().clear();
			usuarioExistente.getTelefones().addAll(usuarioAtualizado.getTelefones());
		}

		return usuarioRepository.save(usuarioExistente);
	}

	public void deletaUsuarioPorId(Long id) {
		if (!usuarioRepository.existsById(id)) {
			throw new ConflictException("Usuário não encontrado com ID: " + id);
		}
		usuarioRepository.deleteById(id);
	}

	public void emailExiste(String email) {
		if (verificaEmailExistente(email)) {
			throw new ConflictException("Email já cadastrado: " + email);
		}
	}

	public boolean verificaEmailExistente(String email) {
		return usuarioRepository.existsByEmail(email);
	}

}