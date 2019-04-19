package com.fungame.core.web.session;

import java.security.Key;

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwe.ContentEncryptionAlgorithmIdentifiers;
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwe.KeyManagementAlgorithmIdentifiers;
import org.jose4j.keys.AesKey;
import org.jose4j.lang.JoseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fungame.utils.mapper.JSONMapper;

public class SessionAuthHelper {
	private static final Logger logger = LoggerFactory.getLogger(SessionAuthHelper.class);
	public static String skey = "lNSc5ctILTdB5c8d";
	private static Key key = new AesKey(skey.getBytes());

	public static String encode(SessionVals vals) throws Exception {
		JsonWebEncryption jwe = new JsonWebEncryption();
		jwe.setPayload(JSONMapper.toJSONString(vals));
		jwe.setAlgorithmHeaderValue(KeyManagementAlgorithmIdentifiers.A128KW);
		jwe.setEncryptionMethodHeaderParameter(ContentEncryptionAlgorithmIdentifiers.AES_128_CBC_HMAC_SHA_256);
		jwe.setKey(key);
		String serializedJwe = jwe.getCompactSerialization();
		return serializedJwe;
	}
	
	public static SessionVals decode(String auth) {
		if("undefined".equals(auth) || "[undefined]".equals(auth) || "[object Undefined]".equals(auth)) return null;
		JsonWebEncryption jwe = new JsonWebEncryption();
		jwe.setAlgorithmConstraints(
				new AlgorithmConstraints(ConstraintType.WHITELIST, KeyManagementAlgorithmIdentifiers.A128KW));
		jwe.setContentEncryptionAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST,
				ContentEncryptionAlgorithmIdentifiers.AES_128_CBC_HMAC_SHA_256));
		jwe.setKey(key);
		try {
			jwe.setCompactSerialization(auth);
			String payload = jwe.getPayload();
			SessionVals vals = JSONMapper.toJavaBean(payload, SessionVals.class);
			return vals;
		} catch (JoseException e) {
			logger.warn(auth, e);
		}
		return null;
	}
//	public static void main(String args[]) throws Exception {
//		SessionVals vals = new SessionVals();
//		vals.setNickname("a");
//		vals.setOpenid("aaaa");
//		vals.setPf("a");
//		vals.setUid(9999);
//		vals.setUnionid("pppp");
//		System.out.println(encode(vals));
//	}
}
