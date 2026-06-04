package com.skillshare.config;

import com.skillshare.entity.User;
import com.skillshare.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        Map<String, Object> attributes = oauthToken.getPrincipal().getAttributes();
        String provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
        User.AuthProvider authProvider = User.AuthProvider.valueOf(provider);

        String email;
        String name;
        String avatarUrl;
        String providerId;

        if (authProvider == User.AuthProvider.GOOGLE) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
            avatarUrl = (String) attributes.get("picture");
            providerId = (String) attributes.get("sub");
        } else if (authProvider == User.AuthProvider.GITHUB) {
            email = (String) attributes.get("email");
            if (email == null) {
                email = attributes.get("login") + "@github.com";
            }
            name = (String) attributes.get("login");
            avatarUrl = (String) attributes.get("avatar_url");
            providerId = attributes.get("id").toString();
        } else {
            throw new IllegalStateException("Unsupported OAuth provider: " + provider);
        }

        Optional<User> existingUser = userRepository.findByProviderAndProviderId(authProvider, providerId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);
        } else {
            String username = generateUniqueUsername(name);
            user = User.builder()
                    .email(email)
                    .username(username)
                    .avatarUrl(avatarUrl)
                    .bio("")
                    .provider(authProvider)
                    .providerId(providerId)
                    .build();
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        response.sendRedirect("http://localhost:3000/oauth2/redirect?token=" + token);
    }

    private String generateUniqueUsername(String name) {
        String base = name.toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = base;
        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
            username = base + suffix;
            suffix++;
        }
        return username;
    }
}
